import React, { PropsWithChildren } from 'react'
import { Link } from 'react-router-dom'
import './UnstyledLink.css'
interface Props {
    to: string
    className?: string
    color?: string
}

const UnstyledLink = (props: PropsWithChildren<Props>) => {
    return (
        <Link
            style={{
                color: props.color
            }}
            to={props.to} className={props.className ? 'unstyled-link ' + props.className : 'unstyled-link'}>
            {props.children}
        </Link>
    )
}


export default UnstyledLink
