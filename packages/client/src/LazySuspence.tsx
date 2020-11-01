import React, { Suspense } from 'react'


export default function LazySuspense(Component: React.LazyExoticComponent<React.ComponentType<any>>, fallback?: React.ReactNode) {
    return (props: any) => <Suspense fallback={fallback || null}><Component {...props} /></Suspense>
}