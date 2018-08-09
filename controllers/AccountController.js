//Включает в себя все действия, связанные непосредственно с аккаунтом (получение информации о себе, чатах и т.п.)
const AccountModel=require('../models/AccountModel');

function AccountController() {
    this.exit = (id)=>{
        return AccountModel.exit_programm(id)
    };

    this.get_contacts = (id)=>{
        return AccountModel.get_contacts(id)
    };

    this.get_groups = (id)=>{
        return AccountModel.get_groups(id)
    };

    this.get_own_profile = (my_id)=>{
        return AccountModel.get_own_profile(my_id)
    };


}

module.exports = new AccountController();
