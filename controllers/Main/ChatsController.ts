import "reflect-metadata";
// import {AccountModel} from "../../models/AccountModel";
import {UserModel} from "../../models/UserModel";
import {Controller} from "../Controller";
import {ChatModel} from "../../models/ChatModel";

class ChatsController extends Controller {

    public queried_chats:object;

    async init_chats() {
        let self_info=await this.get_self_info();
        // let account = await AccountModel.findOne(1);
        // console.log(account);
        // if (!account.address) {
        //     account.address = this.dxmpp.get_address();
        //     await account.save();
        // }
        self_info.state='menu_chats';
        this.send_data(this.events.change_app_state, this.render('main/main.pug', {state:''}));
        // todo: load all chats.
        await this.load_chats(this.chat_types.user)
    };

    private async load_chat(chat:ChatModel, general_chat_type) {
        if (chat.type===this.chat_types.user){
            await chat.get_user_chat_meta();
        }
        let html = this.render('main/chatsblock/chats/imDialog.pug', chat);
        // console.log({id: chat.id, type: general_chat_type, html: html});
        this.send_data('buddy', {id: chat.id, type: general_chat_type, html: html})
    }

    async user_change_state(user, state, statusText, resource) {
        let self_info=await this.get_self_info();
        let userModel = await UserModel.findOne(user.id);
        // let e;
        if (userModel) {
            userModel.online = state === 'online';
            await userModel.save();
            let chat=await ChatModel.get_user_chat(self_info.id,user.id);
            // user.type = this.chat_types.user;
            await this.load_chat(chat, this.chat_to_menu.user);
        } else {
            userModel = new UserModel();
            userModel.id = user.id;
            userModel.domain = user.domain;
            userModel.online = true;
            console.log('saving new user '+ userModel.id);
            console.log(userModel);
            await userModel.save();
            // try {
            //     await userModel.save();
            // } catch (e) {
            //     console.log(e);
            //     return;
            // }
            // console.log(e);

            let user_chat=new ChatModel();
            user_chat.id=ChatModel.get_user_chat_id(self_info.id,user.id);
            user_chat.type=this.chat_types.user;
            user_chat.users=[self_info,userModel];
            await user_chat.save();
            // console.log(e);

            this.dxmpp.get_vcard(user)
        }
    }

    async load_chats(type:string,first:boolean=false){
        console.log('load_chats');
        let self_info=await this.get_self_info();
        // chats
        // let chats=[];

        let chats=await ChatModel.get_chats_by_type(type);
        let menu_chat:string;
        if (type===this.chat_types.user){
            menu_chat=this.chat_to_menu.user;
        } else if (type===this.chat_types.group) {
            menu_chat=this.chat_to_menu.group;
        }
        // console.log(chats);
        // switch (type) {
        //     case this.chat_types.user:
        //         chats=await UserModel.find({take:20});
        //         break;
        //     case this.chat_types.channel:
        //         chats=await ChatModel.find({take:20});
        //         break;
        //     default:
        //         break;
        // }

        if (!chats.length) return;
        await chats.forEach(async (chat)=>{
            if (chat.id === '0x0000000000000000000000000000000000000000_'+self_info.id && first)
                chat.active=true;
            // console.log(chat);
            await this.load_chat(chat, menu_chat);
        });
    }

    async show_chat_info(data){
        if (Object.values(this.group_chat_types).includes(data.type)) {
            switch (data.type) {
                case this.group_chat_types.channel: {
                    let user = await ChatModel.findOne(data.id);
                    this.send_data('get_my_vcard',this.render('main/modal_popup/group_info.pug',user));
                    break;
                }
                // case this.group_chat_types.group: {
                //     console.log(data.type);
                //     break;
                // }
            }
        } else if (data.type===this.chat_types.user){
            let user = await ChatModel.get_chat_opponent(data.id);
            // let user = chat.get_chat_opponent();
            // chat.id = await chat.get_user_chat_meta();
            // chat.id=id;
            this.send_data('get_my_vcard',this.render('main/modal_popup/modal_content.pug',user));
        }
    }

    async get_my_vcard() {
        let self_info=await this.get_self_info();
        // return ret;
        // console.log(ret);
        this.send_data('get_my_vcard', this.render('main/modal_popup/modal_content.pug', self_info));
    }

    async user_vcard(vcard) {
        let self_info=await this.get_self_info();
        let user = await UserModel.findOne(vcard.id);
        if (!user) console.log(`user ${user.id} not found in db`);
        user.avatar = vcard.avatar;
        user.name = vcard.name;
        user.bio = vcard.bio;
        user.firstname = vcard.firstname;
        user.lastname = vcard.lastname;
        // console.log(user);
        await user.save();
        // try {
        //     await user.save();
        // } catch (e) {
        //     console.log(e);
        //     return;
        // }
        user.type = this.chat_types.user;
        let chat=await ChatModel.get_user_chat(self_info.id,user.id);
        await this.load_chat(chat, this.chat_to_menu.user);
    }

    async subscribe(user) {
        console.log(`subscribing to user ${user.id}`);
        this.dxmpp.subscribe(user);
    }

    async user_subscribed(user) {
        this.dxmpp.acceptSubscription(user);
        let check = await UserModel.findOne(user.id);
        if (!check)
            await this.subscribe(user);
    }

    async joined_room(room_data) {
        // console.log(room_data);
        let chat=new ChatModel();

        chat.id=room_data.id;
        chat.domain=room_data.domain;
        chat.avatar=room_data.avatar;
        chat.name=room_data.name;
        chat.type=room_data.channel === "1" ? this.group_chat_types.channel : this.group_chat_types.group;
        chat.role=room_data.role;
        if (room_data.bio)
            chat.bio=room_data.bio;
        if (room_data.contractaddress)
            chat.contract_address=room_data.contractaddress;

        await chat.save();

        await this.load_chat(chat,this.chat_to_menu.group)
    }

    async create_group(group_name:string) {
        let group={name:group_name,domain:"localhost"};
        this.dxmpp.register_channel(group, '');
    }

    async find_groups(group_name:string) {
        this.dxmpp.find_group(group_name);
    }

    async join_chat(chat) {
        this.dxmpp.join(chat)
    }

    async user_joined_room(user, room_data) {
        console.log(room_data);
        let chat = await ChatModel.findOne(room_data.id);
        console.log(chat);
        this.send_data('user_joined_room',`user ${user.id} joined ${chat.name}`);
    }

    async found_groups(result:any) {
        this.queried_chats={};
        // let html = "";
        console.log(result);

        result.forEach(async (group) => {
            console.log(group);

            const st = group.jid.split('@');
            group.id = st[0];
            group.domain = st[1];

            let chat = await ChatModel.findOne(group.id);

            if (chat)
                group.type = chat.type;
            else
                group.type = group.channel === '1' ? this.group_chat_types.join_channel : this.group_chat_types.join_group;
            // if (chats[group.id]) return;
            // group.contract_address = group.contractaddress;
            // let html = this.render('main/chatsblock/chats/imDialog.pug', chat);
            // console.log({id: chat.id, type: general_chat_type, html: html});
            this.queried_chats[group.id]=group;

            this.send_data('found_chats', this.render('main/chatsblock/chats/imDialog.pug', group));
            // this.load_chat(group,this.chat_to_menu.group);
            // html += this.render('main/chatsblock/chats/imDialog.pug',group);
        });
        // if (html) {
        //     this.send_data('found_chats', html)
        // }
    }
}

module.exports = ChatsController;