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
        <Container className="w-full max-sm:h-auto">

            <span className='text-center text-2xl font-bold font-["Mulish"]'>
                <span className='text-slate-200 '>crono</span>
                <span className='text-green-300 '>mate</span>
            </span>

            <nav className="flex flex-1 flex-col gap-1 max-sm:flex-row max-sm:flex-wrap">
                {linksTop.map((link, index) => <SidebarLink key={link.to || index} link={link} />)}
                <div className='flex-1'></div>
                {linksBottom.map((link, index) => <SidebarLink key={link.to || index} link={link} />)}
            </nav>

            <span className='text-center text-sm font-semibold text-slate-600'>
                v{appVersion}
            </span>

        </Container >
    );
}

