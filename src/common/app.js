import Fluxible from 'fluxible';
import AppStore from './stores/AppStore';
import UserStore from './stores/UserStore';
import routes from './components/routes';

const app = new Fluxible({
  component: routes,
  stores: [
    AppStore,
    UserStore
  ]
});

export default app;