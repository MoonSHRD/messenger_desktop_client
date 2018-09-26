import "reflect-metadata";
import {AccountModel} from "../../models/AccountModel";
import {UserModel} from "../../models/UserModel";
import {Controller} from "../Controller";
import {MessageModel} from "../../models/MessageModel";
import {ChatModel} from "../../models/ChatModel";
import {assertAnyTypeAnnotation} from "babel-types";

class MessagesController extends Controller {

    // private static async get_user_and_acc(id) {
    //     let account = await AccountModel.findOne(1);
    //     let userModel = await UserModel.findOne(id);
    //     return {account, userModel}
    // }

    // async get_user_chat_messages(user) {
    //     console.log("user id: "+user.id);
    //     let self_info=await this.get_self_info();
    //     let userModel = await UserModel.findOne(user.id);
    //     let chat=await ChatModel.get_user_chat_with_messages(self_info.id,user.id);
    //     // let messages = await ChatModel.get_user_chat_messages(self_info.id,userModel.id);
    //
    //     // console.log(userModel);
    //     // userModel.type=this.chat_types.user;
    //     let html = this.render('main/messagingblock/qqq.pug', chat);
    //     this.send_data('reload_chat', html);
    //
    //     chat.messages.forEach((message) => {
    //         this.render_message(message, self_info, userModel);
    //     });
    // };
    async load_join_chat(chat_id:string){
        let q_chats = this.controller_register.get_controller_parameter('ChatsController','queried_chats');
        let chat = q_chats[chat_id];
        chat.type=this.group_chat_types.join_channel;
        this.send_data(this.events.reload_chat, this.render('main/messagingblock/qqq.pug',chat));
    }

    async get_chat_messages(chat_id:string) {
        console.log('get_chat_messages');
        // let self_info=await this.get_self_info();
        // console.log(chat_id);
        // chat_id=await ChatModel.get_user_chat_id(self_info.id,chat_id);
        let chat=await ChatModel.findOne(chat_id);
        // ChatModel.

        if (!chat)
            return this.load_join_chat(chat_id);

        // console.log(chat);
        switch (chat.type) {
            case this.chat_types.user:
                await chat.get_user_chat_meta();
                break;
        }
        // let chat=await ChatModel.get_user_chat_with_messages(self_info.id,user.id);
        // let messages = await ChatModel.get_user_chat_messages(self_info.id,userModel.id);

        // console.log(chat);
        // userModel.type=this.chat_types.user;
        let html = this.render('main/messagingblock/qqq.pug', chat);
        // console.log(html);
        this.send_data('reload_chat', html);

        await this.render_chat_messages(chat_id);
    };

    private async render_message(message: MessageModel,chat_id:string) {
        let self_info=await this.get_self_info();
        message.sender_avatar=message.sender.avatar;
        message.mine=(self_info.id===message.sender.id);
        let html = this.render('main/messagingblock/message.pug', message);
        // console.log(message);
        const data = {
            id: chat_id,
            message: html,
        };
        this.send_data('received_message', data);
    }

    private async render_chat_messages(chat_id:string) {
        let messages=await MessageModel.get_chat_messages_with_sender(chat_id);

        messages.forEach((message) => {
            // message.sender_avatar=message.sender.avatar;
            // message.mine=(self_info.id===message.sender.id);
            this.render_message(message,chat_id);
        });
        // message.mine = message.sender.id === me.id;
        // message.sender_avatar = message.mine ? me.avatar : user.avatar;
        // let html = this.render('main/messagingblock/message.pug', message);
        // const data = {
        //     id: user.id,
        //     message: html,
        // };
        // this.send_data('received_message', data);
    }

    async send_message({id, text}) {
        // console.log(id);
        // console.log(text);
        let self_info=await this.get_self_info();
        let chat = await ChatModel.findOne(id);
        let date = new Date();
        let message = new MessageModel();
        message.sender = self_info;
        message.text = text;
        message.time= `${date.getHours()}:${date.getMinutes()}`;
        message.chat = chat;
        await message.save();
        let group:boolean;

        if (chat.type===this.chat_types.user){
            chat.id = await chat.get_user_chat_meta();
            group=false;
        } else if (Object.values(this.group_chat_types).includes(chat.type)) {
            group=true;
        }

        this.dxmpp.send(chat, text, group);
        await this.render_message(message, id);
    };

    async received_message(user, text) {
        // console.log(user);
        // console.log(text);
        let self_info=await this.get_self_info();
        let userModel=await UserModel.findOne(user.id);
        let chat=await ChatModel.get_user_chat(self_info.id,user.id);
        // let {account, userModel} = await MessagesController.get_user_and_acc(user.id);
        let message = new MessageModel();
        message.text = text;
        message.sender = userModel;
        message.chat = chat;
        message.time = this.dxmpp.take_time();
        await message.save();
        await this.render_message(message,chat.id);
    };

    async received_group_message(room_data, message, sender, stamp) {
        // console.log(user);
        // console.log(text);
        let self_info=await this.get_self_info();

        if (self_info.id===sender.address) return;

        let userModel:UserModel;
        if (sender)
            userModel=await UserModel.findOne(sender.address);

        let chat=await ChatModel.findOne(room_data.id);
        // let {account, userModel} = await MessagesController.get_user_and_acc(user.id);
        let messageModel = new MessageModel();
        messageModel.text = message;
        messageModel.sender = userModel;
        messageModel.chat = chat;
        messageModel.time = stamp?stamp:this.dxmpp.take_time();
        await messageModel.save();
        await this.render_message(messageModel,chat.id);
    };
}

module.exports = MessagesController;