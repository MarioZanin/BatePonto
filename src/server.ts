import { App } from './app';

const PORT = process.env.PORT || 3333;

new App().express.listen(PORT, () => console.log('🏃 Server Running into ' + PORT));
