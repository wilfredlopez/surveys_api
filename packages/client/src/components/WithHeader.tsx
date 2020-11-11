import React from 'react'
import AppMenu from './AppMenu'


interface OtherProps {
}





function WithHeader<P extends {}>(WrappedComponent: (props: P) => JSX.Element): (props: P & OtherProps) => JSX.Element & React.ComponentType<P & OtherProps>
function WithHeader<P extends {}>(WrappedComponent: (props: P) => JSX.Element): React.ComponentType<P & OtherProps>
function WithHeader<P extends {}>(WrappedComponent: React.ComponentType<P>): React.ComponentType<P & OtherProps> {
    return (props: P & OtherProps) => {
        // Wraps the input component in a container, without mutating it. Good!
        return <React.Fragment>
            <AppMenu />
            <WrappedComponent {...props} />
        </React.Fragment>
    }

}

export default WithHeader