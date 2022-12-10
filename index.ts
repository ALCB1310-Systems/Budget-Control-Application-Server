import app from './src'
import { port } from './environment'

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})