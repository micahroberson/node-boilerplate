import Fluxible from 'fluxible';
import AppStore from './stores/AppStore';
import UserStore from './stores/UserStore';
import Routes from './components/Routes';

const app = new Fluxible({
  component: Routes,
  stores: [
    AppStore,
    UserStore
  ]
});

export default app;