"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paths = {
    root: __dirname + '/../',
    src: __dirname,
    components: __dirname + '/components/',
    controllers: __dirname + '/../controllers/',
    models: __dirname + '/../models/',
    storage: __dirname + '/../storage/',
    db: __dirname + '/../storage/data.db',
};
const pug_options = {
    cache: true,
};
const chat_types = {
    user: 'user_chat',
    group: 'group_chat',
};
const chat_to_menu = {
    user: 'menu_user_chats',
    group: 'menu_chats',
};
const group_chat_types = {
    group: 'group',
    channel: 'channel',
    join_group: 'join_group',
    join_channel: 'join_channel',
};
// const menues
const events = {
    change_app_state: "change_app_state",
    change_menu_state: "change_menu_state",
    generate_mnemonic: "generate_mnemonic",
    submit_mnemonic: "submit_mnemonic",
    submit_profile: "submit_profile",
    online: "online",
    buddy: "buddy",
    send_subscribe: "send_subscribe",
    get_buddies: "get_buddies",
    send_message: "send_message",
    get_chat_msgs: "get_chat_msgs",
    subscribe: "subscribe",
    chat: "chat",
    find_groups: "find_groups",
    received_vcard: "received_vcard",
    get_my_vcard: "get_my_vcard",
    reload_chat: "reload_chat",
};
exports.helper = {
    paths,
    chat_types,
    group_chat_types,
    chat_to_menu,
    events,
    pug_options
};
//# sourceMappingURL=var_helper.js.map