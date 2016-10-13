import Fluxible from 'fluxible';
import UsersStore from './stores/UsersStore';
import TeamsStore from './stores/TeamsStore';
import routes from './components/routes';
import UserAgentPlugin from './plugins/UserAgentPlugin';

const app = new Fluxible({
  component: routes,
  stores: [
    UsersStore,
    TeamsStore
  ]
});

app.plug(new UserAgentPlugin());

export default app
