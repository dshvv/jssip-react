import './style.less';
import { Image } from 'antd';
import emitter from '../../utils/emitter';
import { useSelector } from 'react-redux';
import { callStatusZh, sipStatusZh } from '../../utils/call-status-zh';
import ReactDOM from 'react-dom';
import Dials from '../dials';
import Callin from '../callin'
import sipHelper from '../../utils/sip-helper';

function CallHeader() {

    const callStatus = useSelector(state => state.callStatus);
    const fsStatus = useSelector(state => state.fsStatus);
    const holdStatus = useSelector(state => state.holdStatus);

    const callAction = (action) => {
        if (action === 'fsLogin') {
            if (fsStatus === 'registered') {
                sipHelper.logout();
            } else {
                if (fsStatus === '') {
                    sipHelper.login();
                }

            }

        } else if (action === 'call') {
            emitter.setDialsVisible.call(true)
        } else if (action === 'hangUp') {
            sipHelper.hangUp();
        } else if (action === 'hold') {
            sipHelper.hold();
        } else if (action === 'unhold') {
            sipHelper.unhold();
        }
    }

    return (
        <>
            <div className='call-header'>
                <div className='call-header-item fslogin' onClick={() => { callAction('fsLogin') }}>
                    <div className='call-header-item-icon'><Image preview={false} width={26} height={26} src={require('../../assets/call-header/fslogin.png').default} /></div>
                    <div className='call-header-item-txt'>{fsStatus ? sipStatusZh[fsStatus] : '登录'}</div>
                </div>
                <div className='call-header-calltool' style={{ opacity: fsStatus === 'registered' ? 1 : 0.2, pointerEvents: fsStatus === 'registered' ? 'auto' : 'none' }}>
                    {callStatus === 'confirmed' || callStatus === 'accepted' ? <>
                        <div className='call-header-item' onClick={() => { callAction('hangUp') }}>
                            <div className='call-header-item-icon'><Image preview={false} width={30} src={require('../../assets/call-header/hangup.png').default} /></div>
                            <div className='call-header-item-txt'>挂断</div>
                        </div>

                        {holdStatus.local || holdStatus.remote ?
                            <div className='call-header-item' onClick={() => { callAction('unhold') }}>
                                <div className='call-header-item-icon'><Image preview={false} width={28} src={require('../../assets/call-header/unhold.png').default} /></div>
                                <div className='call-header-item-txt'>继续</div>
                            </div> :
                            <div className='call-header-item' onClick={() => { callAction('hold') }}>
                                <div className='call-header-item-icon'><Image preview={false} width={28} src={require('../../assets/call-header/hold.png').default} /></div>
                                <div className='call-header-item-txt'>暂停</div>
                            </div>
                        }
                    </> :
                        <div className='call-header-item' onClick={() => { callAction('call') }}>
                            <div className='call-header-item-icon'><Image preview={false} width={30} src={require('../../assets/call-header/call.png').default} /></div>
                            <div className='call-header-item-txt'>拨打</div>
                        </div>

                    }

                    <div className='call-header-item' style={{ width: 100 }}>
                        <div className='call-header-item-icon'>
                            {callStatus === 'confirmed' || callStatus === 'accepted' ?
                                <Image preview={false} width={30} src={require('../../assets/call-header/tonghuazhong.gif').default} /> :
                                <Image preview={false} width={30} src={require('../../assets/call-header/kefu.png').default} />}
                        </div>
                        <div className='call-header-item-txt'>{callStatus ? callStatusZh[callStatus] : '空闲中'} {(holdStatus.remote||holdStatus.local) && '--暂停中'}</div>
                    </div>
                </div>

            </div>
            {ReactDOM.createPortal(<Dials />, document.body)}
            {ReactDOM.createPortal(<Callin />, document.body)}
        </>
    )
}
export default CallHeader;