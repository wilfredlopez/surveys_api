import React from 'react'
import {SkeletonElement} from 'wl-react-skeleton'
interface Props {
    
}

export const SurveySkeleton = (props: Props) => {
    return (
        <div>
            <SkeletonElement type="title" />
            <SkeletonElement type="text" />
            <SkeletonElement type="text" />
            <SkeletonElement type="text" maxWidth={100} />
        </div>
    )
}
