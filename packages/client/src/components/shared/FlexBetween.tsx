import { Box } from '@material-ui/core'
import React, { PropsWithChildren } from 'react'

interface Props {

}

const FlexBetween = (props: PropsWithChildren<Props>) => {
    return (
        <Box display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center">
            {props.children}
        </Box>
    )
}

export default FlexBetween
