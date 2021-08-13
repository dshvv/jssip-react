
import './style.less';
import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import sipHelper from '../../utils/sip-helper';
import emitter from '../../utils/emitter';
import { message } from 'antd';
import store from '../../store'

function Dials() {
    const [phone, setPhone] = useState('');
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // // 第一个入参为注册名(不重要), setDialsVisibleEmitterHandel事件的回调
        emitter.setDialsVisible.tap('1', setDialsVisibleEmitterHandel)
    }, [])  // 要么监听fsStatus重新执行钩子，要么使用store.getState().fsStatus

    /**
     * setDialsVisible事件的回调
     * @param {*} visible 
     * @param {*} phoneNumber 
     */
    const setDialsVisibleEmitterHandel = (visible, phoneNumber) => {
        if (store.getState().fsStatus !== 'registered') {
            message.error('请先登录分机');
        } else if(store.getState().callStatus === 'accepted' || store.getState().callStatus === 'confirmed'){
            message.error('在通话中，不能在拨打');
        }else{
            setVisible(visible);
            phoneNumber && setPhone(phoneNumber);
        }
    }

    const modelHelper = {
        title: '拨电话',
        visible,
        footer: null,
        closable: false
    }

    const numbers = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        ['*', 0, '#'],
        ['keyboard', 'dial', 'rm']
    ];

    const clickKeyboard = (e) => {
        if (e === 'keyboard') {
            setVisible(false)
        } else if (e === 'dial') {
            sipHelper.call(phone)
            setVisible(false);
            setPhone('');
        } else if (e === 'rm') {
            setPhone(phone.slice(0, phone.length - 1));
        } else {
            setPhone(phone + e);
        }
    }

    const phoneIptChange = (e) => {
        setPhone(e.target.value)
    }


    return (
        <Modal {...modelHelper}>
            <div className="dialsWrapp">


                <div className="phone">
                    <input value={phone} onChange={phoneIptChange} placeholder='请输入' />
                </div>
                <div className="numbers">
                    {numbers.map(itemGroup => (
                        <div key={itemGroup} className="item-group">
                            {itemGroup.map(item => (
                                <div className="item" key={item} onClick={() => { clickKeyboard(item) }}>
                                    {(() => {
                                        if (item === 'keyboard') {
                                            return <img alt='' src={require('../../assets/img/keyboard.png').default} />
                                        } else if (item === 'dial') {
                                            return <img alt='' src={require('../../assets/img/dial.gif').default} className="dial" />
                                        } else if (item === 'rm') {
                                            return <img alt='' src={require('../../assets/img/rm.png').default} />
                                        } else {
                                            return item
                                        }
                                    })()}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

            </div>
        </Modal>

    );
}

export default Dials;
