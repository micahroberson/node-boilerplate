import _ from 'lodash';
import BaseStore from './BaseStore';

class PaginatedStore extends BaseStore {
  static defaultPagination = {offset: 0, limit: 30};
  static defaultSorter = null;

  constructor(dispatcher) {
    super(dispatcher);

    this.reset();
  }

  get orderedEntities() {
    return this.orderedEntityIds.map((id) => {
      return this.entities.get(id);
    });
  }

  reset() {
    this.entities = new Map();
    this.orderedEntityIds = [];

    this.currentFilters = [];
    this.currentPagination = this.constructor.defaultPagination;
    this.currentSorter = this.constructor.defaultSorter;
  }

  fetchEntitySuccess(entity) {
    let id = entity.get('id');
    this.entities.set(id, entity);
  }

  listEntitiesStart(data={}) {
    if(data.forceRetry || !_.isEqual(data.sorter, this.currentSorter) || !_.isEqual(data.filters, this.currentFilters)) {
      this.orderedEntityIds = [];
      this.currentPagination = data.pagination || this.constructor.defaultPagination;
      this.currentSorter = data.sorter || this.constructor.defaultSorter;
      this.currentFilters = data.filters || [];
    } else if(data.pagination.offset !== this.currentPagination.offset || data.pagination.limit !== this.currentPagination.limit) {
      this.currentPagination = data.pagination;
    }
  }

  listEntitiesSuccess(data) {
    if(!_.isEqual(data.sorter, this.currentSorter) || !_.isEqual(data.filters, this.currentFilters)) {
      return;
    }
    if(_.isEqual(data.pagination, this.currentPagination)) {
      this.orderedEntityIds = [];
    }
    data.entities.forEach((entity) => {
      this.orderedEntityIds.push(entity.id);
      this.entities.set(entity.id, entity);
    });
  }

  deleteEntitySuccess(entityId) {
    let orderedEntityIdsIndex = this.orderedEntityIds.indexOf(entityId);
    if(-1 !== orderedEntityIdsIndex) {
      this.orderedEntityIds.splice(orderedEntityIdsIndex, 1);
    }
    this.entities.delete(entityId);
  }

  getCurrentListState() {
    return {
      entities: this.orderedEntities,
      filters: this.currentFilters,
      sorter: this.currentSorter,
      pagination: this.currentPagination,
    };
  }

  dehydrate() {
    return Object.assign(super.dehydrate(), {
      entities: this.entities.entries(),
      orderedEntityIds: this.orderedEntityIds,
      currentFilters: this.currentFilters,
      currentPagination: this.currentPagination,
      currentSorter: this.currentSorter,
    });
  }

  rehydrate(state) {
    this.entities = new Map(state.entities.map((keyValueTuple) => {
      return [keyValueTuple[0], new this.constructor.modelClass(keyValueTuple[1])];
    }));
    this.orderedEntityIds = state.orderedEntityIds;
    this.currentFilters = state.currentFilters;
    this.currentPagination = state.currentPagination;
    this.currentSorter = state.currentSorter;
  }
}

export default PaginatedStore;