import { version } from '../../../package.json';
const appVersion = version;

import { ReactNode } from 'react';
import Container from "./Container";
import { Link as LinkType } from "src/shared/types/Link";
import SidebarLink from 'src/shared/layouts/SidebarLink';


interface LinkBtnType extends LinkType {
    text?: string,
    icon?: ReactNode
}
interface Props {
    linksTop: Array<LinkBtnType>,
    linksBottom: Array<LinkBtnType>
}

export default function Sidebar({ linksTop, linksBottom }: Props) {

    return (
        <Container width="min-w-56">

            <span className='text-center text-2xl font-bold font-["Mulish"]'>
                <span className='text-slate-200 '>crono</span>
                <span className='text-green-300 '>mate</span>
            </span>

            <div className="flex flex-col flex-1 gap-1">
                {linksTop.map((link, index) => <SidebarLink key={link.to || index} link={link} />)}
                <div className='flex-1'></div>
                {linksBottom.map((link, index) => <SidebarLink key={link.to || index} link={link} />)}
            </div>

            <span className='text-center text-sm font-semibold text-slate-600'>
                v{appVersion}
            </span>

        </Container >
    );
}

