import Fluxible from 'fluxible';
import UsersStore from './stores/UsersStore';
import TeamsStore from './stores/TeamsStore';
import routes from './components/routes';

const app = new Fluxible({
  component: routes,
  stores: [
    UsersStore,
    TeamsStore
  ]
});

export default app
