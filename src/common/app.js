import Fluxible from 'fluxible';
import SubscriptionPlansStore from './stores/SubscriptionPlansStore';
import SubscriptionsStore from './stores/SubscriptionsStore';
import TeamsStore from './stores/TeamsStore';
import UsersStore from './stores/UsersStore';
import routes from './components/routes';
import UserAgentPlugin from './plugins/UserAgentPlugin';

const app = new Fluxible({
  component: routes,
  stores: [
    SubscriptionPlansStore,
    SubscriptionsStore,
    TeamsStore,
    UsersStore,
  ]
});

app.plug(new UserAgentPlugin());

export default app
