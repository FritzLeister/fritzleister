import { Suspense, lazy } from 'react'
import LoadingPage from './LoadingPage'

const App = lazy(() => import('./App'))

export default function DesktopApplication(props) {
    return (
        <Suspense fallback={<LoadingPage />}>
            <App {...props} />
        </Suspense>
    )
}
