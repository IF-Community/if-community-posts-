import { Router } from 'express';

// Initial route
import { helloWorldController } from '../controllers/HelloWorld/helloWorld.Controller';

const router = Router();

// Initial route
router.get('/HelloWorld', helloWorldController)

export { router };