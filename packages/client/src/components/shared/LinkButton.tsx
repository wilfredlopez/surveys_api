import React from 'react'
import UnstyledLink from './UnstyledLink'
import ButtonFlex, { ButtonFlexProps } from '../../styles/ButtonFlex'

interface Props extends ButtonFlexProps {
    to: string
    noPadding?: boolean
    inline?: boolean
    bold?: boolean
    normalCase?: boolean
}

const LinkButton = ({ to, children, inline = false, noPadding = false, bold, normalCase, color = "textDefault", ...buttonProps }: Props) => {
    const styles: React.CSSProperties = {
        padding: noPadding ? 0 : undefined,
        margin: "auto",
        minWidth: "initial",
        display: inline ? 'contents' : undefined,
        fontWeight: bold ? 'bold' : undefined
    }

    if (normalCase) {
        styles.textTransform = 'none'
    }

    return <UnstyledLink to={to}>
        <ButtonFlex
            color={color}
            {...buttonProps} style={{
                ...styles,
                ...buttonProps.style,

            }} >
            {children}
        </ButtonFlex>
    </UnstyledLink>
}

export default LinkButton