import Fluxible from 'fluxible';
import UserStore from './stores/UserStore';
import routes from './components/routes';

const app = new Fluxible({
  component: routes,
  stores: [
    UserStore
  ]
});

export default app
