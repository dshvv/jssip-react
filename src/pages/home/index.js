import { Button } from 'antd';
import emitter from '../../utils/emitter';
import {Link} from "react-router-dom";
import './style.less'

export default function Home(){
    const call = (tel)=>{
        emitter.setDialsVisible.call(true, tel);
    }
    return(
        <div className='home'>
            <div><Link to="/about">查看介绍</Link></div>
            <Button type="primary" onClick={()=>{call()}}>打电话</Button>
            <p></p>
            <Button type="primary"  onClick={()=>{call('018211109905')}}>打丁少华打电话</Button>
        </div>
    )
}