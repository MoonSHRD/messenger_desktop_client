import {config} from "../src/env_config";
import {LocalAddress, CryptoUtils} from 'loom-js';

// const {
//     NonceTxMiddleware, SignedTxMiddleware, Client, ClientEvent, LoomProvider,
//     Contract, Address, LocalAddress, CryptoUtils, BluePrintCreateAccountTx, createJSONRPCClient
// } = require('loom-js');

const LoomTruffleProvider = require('loom-truffle-provider');
const Web3 = require('web3');
let qbox = require('qbox');
const network_abi = require('./network_abi');
const token_abi = require('./token_abi');

export class Loom {

    private static instance: Loom;
    private provider: any;
    private priv: any;
    private pub: any;
    private addr: any;
    public token_addr: string=config.token_addr;
    public token_decimals: number;
    private web3: any;
    private NetRegContract: any;
    private MoonshardTokenContract: any;
    private IdentityContract: any;
    private $: any = qbox.create();

    public static getInstance() {
        if (!Loom.instance) {
            Loom.instance = new Loom();
        }
        return Loom.instance;
    }

    async connect(private_key: string) {
        this.priv = CryptoUtils.B64ToUint8Array(private_key);
        this.pub = CryptoUtils.publicKeyFromPrivateKey(this.priv);
        this.addr = LocalAddress.fromPublicKey(this.pub).toString();
        const loomTruffleProvider = new LoomTruffleProvider(
            "default",
            `http://${config.loom_host}:${config.loom_port}/rpc`,
            `http://${config.loom_host}:${config.loom_port}/query`,
            this.priv,
        );
        this.provider = loomTruffleProvider.getProviderEngine();


        this.web3 = new Web3(this.provider);
        this.NetRegContract = new this.web3.eth.Contract(network_abi, config.net_reg_addr, {from: this.addr});
        this.MoonshardTokenContract=new this.web3.eth.Contract(token_abi, this.token_addr, {from: this.addr});
        this.token_decimals= await await this.MoonshardTokenContract.methods.decimals().call();
    }

    private prep_val(value){
        return value/10^this.token_decimals;
    }

    async set_identity(name: string) {
        return await this.NetRegContract.methods.createIdentity(name).send();
    }

    async get_identity() {
        return (await this.NetRegContract.methods.myIdentity().call()).toLowerCase();
    }

    async get_accs_list() {
        return this.provider.accountsAddrList;
    }

    async get_accs() {
        /** accs with privKeys **/
        return this.provider.accounts;
    }

    async get_identity_safely(name: string) {
        let identity = await this.get_identity();
        if (identity === '0x0000000000000000000000000000000000000000') {
            await this.set_identity(name);
            identity = await this.get_identity();
        }
        return identity.toLowerCase();
    }

    // async get_token_addr() {
    //     let token_addr = '0x4Dd841b5B4F69507C7E93ca23D2A72c7f28217a8'.toLowerCase();
    //     return (await this.NetReg.methods.gettToken(token_addr).call()).toLowerCase();
    // }

    async get_my_balance() {
        let val = await this.MoonshardTokenContract.methods.balanceOf(this.addr).call();
        return this.prep_val(val)
    }

    async get_balance(addres) {
        let val =  await this.MoonshardTokenContract.methods.balanceOf(addres).call();
        return this.prep_val(val)
    }

    async get_total_supply() {
        // let dec = await this.Token.methods.;
        let val =  await this.MoonshardTokenContract.methods.totalSupply().call();
        return this.prep_val(val)
    }

    async set_token_addr(token_addr: string = '') {
        token_addr = '0x4Dd841b5B4F69507C7E93ca23D2A72c7f28217a8'.toLowerCase();
        return await this.NetRegContract.methods.setToken(token_addr).send();
    }

    static generate_private(): string {
        return CryptoUtils.Uint8ArrayToB64(CryptoUtils.generatePrivateKey());
    }
}
