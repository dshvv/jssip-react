import JsSIP from 'jssip';
import store, { setCallStatus, setFsStatus, setHoldStatus } from '../store';
import emitter from '../utils/emitter';
const log = console.log;

class SipHelper {
    static instance;
    coolPhone;
    session;

    /**
     * 单例
     */
    static getInstance() {
        if (!SipHelper.instance) {
            SipHelper.instance = new SipHelper();
        };
        return SipHelper.instance;
    }

    /**
     * 电话断掉后，需要初始化的数据或者执行的方法
     */
    init(){
        this.session = null; // 会话id清空
        store.dispatch(setHoldStatus({local: false, remote: false})); // 全局状态 挂起初始化
        setTimeout(() => {
            store.dispatch(setCallStatus('')); // 电话状态初始化
        }, 1000)
    }

    /**
     * 分机注册，登录
     * @param {*} phoneNumber 分机号码
     */
    login(phone = 199301) {
        store.dispatch(setFsStatus('loging'));
        //创建一个 JsSIP User Agent
        const wsUri = 'wss://test-10-9-12368.aegis-info.com:74431'; // Fs的 ws协议地址
        const sipPwd = 'num1123681'; // FS密码
        const sipUri = 'sip:' + phone + '@test-10-9-12368.aegis-info.com;transport=wss'; // 分机号注册地址 格式 sip: + 分机号码 + @ + FS注册地址
        const configuration = {
            sockets: [new JsSIP.WebSocketInterface(wsUri)],
            uri: sipUri,
            password: sipPwd,
            session_timers: false, // 启用会话计时器（根据RFC 4028)
            user_agent: 'Aegis WebRTC v1.0'
            // outbound_proxy_set: wsUri,
            // display_name: String(phone),
            // autostart: true,   // 自动连接
            // register: true, // 自动就绪
        };
        this.coolPhone = new JsSIP.UA(configuration);

        // Starting the User Agent
        this.coolPhone.start();
        this.setUAEvent();
    }

    /**
   * 绑定ua事件
   * @param {*} ua 
   */
    setUAEvent(ua) {
        // ws 开始尝试连接
        this.coolPhone.on('connecting',  (args)=> {
            log('ws尝试连接');
        });

        // ws 连接完毕
        this.coolPhone.on('connected', ()=> {
            log('ws连接完毕');
        });

        // ws 连接失败
        this.coolPhone.on('disconnected', ()=> {
            log('ws连接失败');
        })

        // SIP 注册成功
        this.coolPhone.on('registered', e => {
            log('SIP已注册')
            store.dispatch(setFsStatus('registered'));
        });

        //  SIP 注册失败
        this.coolPhone.on('registrationFailed', e => {
            log('SIP注册失败')
            store.dispatch(setFsStatus('registrationFailed'));
            setTimeout(() => {
                store.dispatch(setFsStatus(''));
            }, 1000)
        });

        // SIP 取消注册
        this.coolPhone.on('unregistered', e => {
            log('SIP主动取消注册或注册后定期重新注册失败')
            store.dispatch(setFsStatus('unregistered'));
            setTimeout(() => {
                store.dispatch(setFsStatus(''));
            }, 1000)
        });

        // IM消息 事件
        this.coolPhone.on('newMessage', e => log('im新消息事件'));

        // 来电或者外呼事件
        this.coolPhone.on('newRTCSession', e => {
            log(`新的${e.originator === 'local' ? '外呼' : '来电'}`, e);
            const session = e.session;
            this.session = session;
            const peerconnection = session.connection;
            if (e.originator === 'local') {
                peerconnection.addEventListener('addstream', (event) => {
                    const audio = document.querySelector('.audio');
                    audio.srcObject = event.stream;
                });
            } else {
                const callers = session.remote_identity.uri.user;
                emitter.setCallinStatus.call(true, callers);
            }

            // 接听失败
            session.on('failed', mdata => {
                emitter.setCallinStatus.call(false);
                store.dispatch(setCallStatus('failed'));
                this.init();
                log('来电的时候 拒接或者 还没接听对方自己就挂断了');
            });

            // 接听成功
            session.on("accepted", (response, cause) => {
                log('接听成功')
                emitter.setCallinStatus.call(false);
                store.dispatch(setCallStatus('accepted'));
            });

            // 接听成功后 挂断
            session.on('ended', () => {
                log('接听结束');
                store.dispatch(setCallStatus('ended'));
                this.init();
            });

            // 通话被挂起
            session.on('hold', (data) =>{
			    const org = data.originator;
                if(org === 'local'){
                    log('通话被本地挂起:', org);
                    store.dispatch(setHoldStatus({local: true}));
                }else{
                    store.dispatch(setHoldStatus({remote: true}));
                    log('通话被远程挂起:', org);
                }
		    });

            // 通话被继续
            session.on('unhold', (data) =>{
                const org = data.originator;
                if(org === 'local'){
                    log('通话被本地继续:', org)
                    store.dispatch(setHoldStatus({local: false}));;
                }else{
                    log('通话被远程继续:', org);
                    store.dispatch(setHoldStatus({remote: false}));
                }
            });
        });
    }

    /**
     * 登出
     */
    logout() {
        this.coolPhone.unregister(); // 注销
        this.coolPhone.stop({ register: true });
        store.dispatch(setFsStatus(''));
    }

    /**
     * 拨打
     * @param {*} phoneNumber 拨打号码
     */
    call(phoneNumber) {
        const options = {
            eventHandlers: {
                progress(e) {
                    log('正在呼叫:', e);
                    store.dispatch(setCallStatus('calling'));
                },
                failed(e) {
                    log('呼叫失败: ', e);
                    store.dispatch(setCallStatus('callFailed'));
                    setTimeout(() => {
                        store.dispatch(setCallStatus(''));
                    }, 1000)
                },
                ended(e) {
                    log('呼叫结束:' + e.originator === 'remote' ? '对方挂断' : '自己挂断', e);
                    store.dispatch(setCallStatus('callEnded'));
                    setTimeout(() => {
                        store.dispatch(setCallStatus(''));
                    }, 1000)
                },
                confirmed(e) {
                    log('呼叫接受' + e.originator === 'remote' ? '自己已接受' : '对方已接受', e);
                    store.dispatch(setCallStatus('confirmed'));
                }
            },
            mediaConstraints: { 'audio': true, 'video': false }
        };
        this.coolPhone.call(`sip:${phoneNumber}`, options);
    }


    /**
    * 接听
    */
    answer() {
        this.session.answer({
            media: {
                constraints: {
                    audio: true,
                    video: false
                },
                render: {
                    remote: document.querySelector('.audio'),
                }
            }
        })
    }

    /**
     * 挂断
     */
    hangUp() {
        if (this.session && this.session.isEnded() === false) {
            this.session.terminate();
        }
        this.session = null;
    }

    /**
     * 挂起
     */
    hold(){
        this.session.hold({ useUpdate: false });
    }

    /**
     * 继续
     */
    unhold(){
        this.session.unhold({ useUpdate: false });
    }
}
export default SipHelper.getInstance();



