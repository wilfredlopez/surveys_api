import React from 'react'
import Button, { ButtonProps } from '@material-ui/core/Button'
import UnstyledLink from './UnstyledLink'

interface Props extends ButtonProps {
    to: string
}

const LinkButton = ({ to, children, ...buttonProps }: Props) => {
    return <UnstyledLink to={to}>
        <Button {...buttonProps}>
            {children}
        </Button>
    </UnstyledLink>
}

export default LinkButton