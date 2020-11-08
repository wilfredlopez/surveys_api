import React from 'react'
import UnstyledLink from './UnstyledLink'
import ButtonFlex, { ButtonFlexProps } from '../../styles/ButtonFlex'

interface Props extends ButtonFlexProps {
    to: string
    withPadding?: boolean
    inline?: boolean
    bold?: boolean
}

const LinkButton = ({ to, children, inline = false, withPadding = false, bold, color = 'text-inherit', ...buttonProps }: Props) => {
    return <UnstyledLink to={to}>
        <ButtonFlex
            color={color}
            {...buttonProps} style={{
                ...buttonProps.style,
                padding: !withPadding ? 0 : undefined,
                margin: "auto",
                textTransform: "none",
                minWidth: "initial",
                display: inline ? 'contents' : undefined,
                fontWeight: bold ? 'bold' : undefined
            }} >
            {children}
        </ButtonFlex>
    </UnstyledLink>
}

export default LinkButton