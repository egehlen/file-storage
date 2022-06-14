import { Divider } from "antd";
import { Footer as AntFooter } from "antd/lib/layout/layout";

import './Footer.css';

function Footer() {
    return (
        <AntFooter>
            Author: <a href="mailto:enzo.gehlen@outlook.com">&nbsp;Enzo Henrique</a>
            <Divider type="vertical" />
            View on&nbsp;<a href="https://github.com/egehlen/decentralized-file-storage">Github</a>
        </AntFooter>
    )
}

export default Footer;