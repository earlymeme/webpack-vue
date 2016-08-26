import createLogger from './logger'


const mutationMiddleware = {
    onMutation (mutation, {count}) {
        console.log('middlewares',count)
    }
}

export default process.env.NODE_ENV !== 'production'
    ? [createLogger(), mutationMiddleware]
    : [mutationMiddleware]
