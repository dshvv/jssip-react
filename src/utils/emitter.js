import { SyncHook }from 'tapable';

// 简单来说就是实例化 Hooks 类
const events =  {
    setDialsVisible: new SyncHook(['visible','phoneNumber']), // 接收一个可选参数，参数是一个参数名的字符串数组
    setCallinStatus: new SyncHook(['status', 'callers'])
};
export default events;