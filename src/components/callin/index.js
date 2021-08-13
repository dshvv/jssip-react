
import './style.less';
import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import sipHelper from '../../utils/sip-helper';
import emitter from '../../utils/emitter';
// import { message } from 'antd';

function Callin() {
    const [visible, setVisible] = useState(false);
    const [callers, setCallers] = useState(false);

    useEffect(() => {
        emitter.setCallinStatus.tap('1', setCallinStatusEmitterHandel)
    }, [])

    /**
     * setCallinStatus事件的回调
     * @param {*} visible 
     */
    const setCallinStatusEmitterHandel = (status, callersPhone) => {
        setVisible(status);
        setCallers(callersPhone);
    }

    const modelHelper = {
        title: '来电弹窗',
        visible,
        // footer: null,
        cancelText:'拒绝',
        okText:'接听',
        closable: false,
        onOk(){
            sipHelper.answer();
        },
        onCancel(){
            sipHelper.hangUp();
        }
    }
    return (
        <Modal {...modelHelper}>
            <div className="dialsWrapp">
                <h1>{callers}</h1>
            </div>
        </Modal>

    );
}

export default Callin;
