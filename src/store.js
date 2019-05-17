import Vue from 'vue'
import Vuex from 'vuex'
import http from './http';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loggingIn: false,
    loginError: null,
    loginSuccessful: false,
    currentUser: null,
    factoryOvens: [],
    creatingShift: false,
    tmpShiftCode: null,
    tmpStartWagons: {},
    startWagonsPerOven: {},
    currentShift: null,
    loading: false,
    operationError: null,
    operationSuccessful: false,
    currentClassification: {},
    productFamilies: {},
    productModels: {},
    classifications: [],
    colors: {},
    operators: [],
    defectAreas: [],
    defectsPerArea: {},
    tmpDefect: null,
    pieceZones: {},
    qualityLevels: [],
    repairTypes: [],
    evaluationTypes: [],
    redirectTo: '',
    allRules: [],
  },
  mutations: {
    initialiseStore(state) {
      let savedState = localStorage.getItem('scpi_store');
      if (savedState) {
        this.replaceState(Object.assign(state, JSON.parse(savedState)));
      }
    },
    loginStart: (state) => state.loggingIn = true,
    loginFinish: (state, result) => {
      state.loggingIn = false;
      state.loginError = result.error;
      state.loginSuccessful = result.error == null;
      if (state.loginSuccessful) {
        state.currentUser = result.user;
      }
    },
    logout: (state) => {
      state.loggingIn = false;
      state.loginError = null;
      state.loginSuccessful = false;
      state.currentUser = null;
    },
    factoryOvensLoaded: (state, ovens) => {
      state.factoryOvens = ovens.map((o) => {
        return {
          ...o,
          wagons: o.wagons[1]
        };
      });
    },
    addStartWagon: (state, wagon) => {
      state.tmpStartWagons = {
        ...state.tmpStartWagons,
        [wagon.oven.id]: wagon.oven.wagons.filter(w => w.code == wagon.wagon)[0]
      };
    },
    operationStart: (state) => {
      state.loading = true;
      state.operationError = false;
      state.operationSuccessful = false;
    },
    operationFinish: (state) => {
      state.loading = false;
      state.operationSuccessful = state.operationError == null;
    },
    operationError: (state, e) => {
      state.operationError = e;
    },
    createShift: (state, result) => {
      state.loading = false;
      state.operationError = result.error;
      state.operationSuccessful = result.error == null;
      if (state.operationSuccessful) {
        state.currentShift = {
          ...result.data,
          pieceClassifications: {
            "estandar": 0,
            "comercial": 0,
            "rotura": 0,
            "resane": 0,
            "evaluacion": 0
          },
        };
        state.tmpShiftCode = null;
        state.startWagonsPerOven = { ...state.tmpStartWagons };
        state.tmpStartWagons = null;
        state.creatingShift = false;
        state.currentClassification = {
          ...state.currentClassification,
          currentOven: state.factoryOvens[0],
          currentWagon: state.startWagonsPerOven[state.factoryOvens[0].id],
        };
      }
    },
    loadProductFamilies: (state, result) => {
      state.loading = false;
      state.operationError = result.error;
      state.operationSuccessful = result.error == null;
      if (state.operationSuccessful) {
        state.productFamilies = result.data;
      }
    },
    loadProductModels: (state, result) => {
      state.loading = false;
      state.operationError = result.error;
      state.operationSuccessful = result.error == null;
      if (state.operationSuccessful) {
        state.productModels = {
          ...state.productModels,
          [result.famId]: result.data,
        };
      }
    },
    selectCurrentModel: (state, model) => {
      // save current classification
      if (state.currentClassification) {
        state.classifications.push(state.currentClassification);
      }
      state.currentClassification = {
        ...state.currentClassification,
        productModel: model,
        product: model,
        productFamily: model.productFamily,
      };
    },
    colorsLoaded: (state, res) => {
      state.colors = res.data;
    },
    colorSelected: (state, color) => {
      state.currentClassification = {
        ...state.currentClassification,
        color: color
      };
    },
    currentWagonSet: (state, wagon) => {
      state.currentClassification = {
        ...state.currentClassification,
        currentWagon: wagon,
      };
    },
    operatorsLoaded: (state, operators) => {
      state.operators = operators;
    },
    castOperatorSelected: (state, operatorCode) => {
      let operator = state.operators.filter((op) => op.code == operatorCode);
      if (!operator.length) {
        operator = state.operators.filter((op) => op.code == 'colador1')[0];
        operator = { ...operator, code: operatorCode };
      }
      state.currentClassification = {
        ...state.currentClassification,
        castOperator: operator,
      };
    },
    coatOperatorSelected: (state, operatorCode) => {
      let operator = state.operators.filter((op) => op.code == operatorCode);
      if (!operator.length) {
        operator = state.operators.filter((op) => op.code == 'barnizador1')[0];
        operator = { ...operator, code: operatorCode };
      }
      state.currentClassification = {
        ...state.currentClassification,
        coatOperator: operator,
      };
    },
    polishOperatorSelected: (state, operatorCode) => {
      let operator = state.operators.filter((op) => op.code == operatorCode);
      if (!operator.length) {
        operator = state.operators.filter((op) => op.code == 'pulidor1')[0];
        operator = { ...operator, code: operatorCode };
      }
      state.currentClassification = {
        ...state.currentClassification,
        polishOperator: operator,
      };
    },
    classificationCreated: (state, { oven, wagon }) => {
      if (state.currentClassification.oven == oven && state.currentClassification.currentWagon == wagon) {
        return;
      }
      state.classifications.push(state.currentClassification);
      state.currentClassification = {
        ...state.currentClassification,
        quantity: 1,
        currentWagon: wagon,
        productionWagon: wagon,
        currentOven: oven,
        polishOperator: wagon.polishOperator,
        coatOperator: wagon.coatOperator,
        castOperator: wagon.castOperator,
        classifierOperator: state.currentUser,
      };
    },
    classificationSaved: (state, classification) => {
      state.classifications.push(classification);
      state.currentClassification = {
        ...state.currentClassification,
        defects: [],
        quantity: 1,
        assignedQualityLevel: null,
        systemQualityLevel: null,
      };
      let pieces = state.currentShift.pieceClassifications;
      let q = classification.assignedQualityLevel || classification.systemQualityLevel;
      let qName = q.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
      state.currentShift = {
        ...state.currentShift,
        pieceClassifications: {
          ...pieces,
          [qName]: pieces[qName] + classification.quantity,
        },
      };
    },
    qualityLevelsLoaded: (state, qualities) => {
      state.qualityLevels = qualities;
    },
    defectAreasLoaded: (state, areas) => {
      state.defectAreas = areas;
    },
    defectsLoaded: (state, { area, defects }) => {
      state.defectsPerArea = {
        ...state.defectsPerArea,
        [area.id]: defects,
      };
    },
    defectAreaSelected: (state, area) => {
      state.tmpDefect = {
        ...state.tmpDefect,
        defectArea: area,
      };
    },
    defectSelected: (state, defect) => {
      state.tmpDefect = {
        ...state.tmpDefect,
        defectType: defect,
      };
    },
    pieceZonesLoaded: (state, { key, data }) => {
      state.pieceZones = {
        ...state.pieceZones,
        [key]: data.map((pz) => pz.pieceZone),
      };
    },
    pieceZoneSelected: (state, zone) => {
      state.tmpDefect = {
        ...state.tmpDefect,
        affectedZone: zone,
      };
    },
    defectSaved: (state, defect) => {
      defect = {
        ...defect,
        className: 'com.pmvb.scpiback.data.models.Defect'
      };
      let defects = state.currentClassification.defects || [];
      defects.push(defect);
      state.currentClassification = {
        ...state.currentClassification,
        defects,
      };
      state.tmpDefect = null;
    },
    qualitySelected: (state, quality) => {
      state.currentClassification = {
        ...state.currentClassification,
        assignedQualityLevel: quality,
      };
    },
    repairSelected: (state, repair) => {
      state.currentClassification = {
        ...state.currentClassification,
        repair: {
          repairType: repair,
        }
      };
    },
    evaluationSelected: (state, evaluation) => {
      state.currentClassification = {
        ...state.currentClassification,
        evaluation: {
          evaluationType: evaluation,
        }
      };
    },
    repairTypesLoaded: (state, repairTypes) => {
      state.repairTypes = repairTypes;
    },
    evaluationTypesLoaded: (state, evaluationTypes) => {
      state.evaluationTypes = evaluationTypes;
    },
    castDateSelected: (state, castingDate) => {
      state.currentClassification = {
        ...state.currentClassification,
        castingDate,
      };
    },
    wagonPositionSelected: (state, wagonPosition) => {
      state.currentClassification = {
        ...state.currentClassification,
        wagonPosition,
      };
    },
    qualityEvaluated: (state, { qualityLevel, facts }) => {
      state.currentClassification = {
        ...state.currentClassification,
        systemQualityLevel: qualityLevel,
        systemFoundFacts: facts,
      };
    },
    rulesLoaded: (state, rules) => {
      state.allRules = rules.map((r) => {
        return {
          ...r,
          consequent: `${r.consequentName} = ${r.consequentValue}`,
          clauses: convertRuleToClauses(r),
        };
      });
    },
    ruleDeleted: (state, rule) => {
      state.allRules = state.allRules.filter((r) => r.id != rule.id);
    },
    ruleSaved: (state, { old, rule }) => {
      state.allRules = [
        ...state.allRules.filter((r) => r.id != rule.id),
        {
          ...old,
          ...rule
        }
      ];
    }
  },
  actions: {
    doLogin({ commit }, loginData) {
      commit('loginStart');

      http.post('login', { ...loginData, className: 'java.util.Map' })
        .then((r) => {
          commit('loginFinish', r.data);
        })
        .catch((e) => {
          commit('loginFinish', { error: e.message });
        })
    },
    doLogout({ commit }) {
      commit('logout');
    },
    addStartingWagon({ commit }, startWagon) {
      commit('addStartWagon', startWagon);
    },
    loadFactoryOvens({ commit }) {
      commit('operationStart');
      http.get('/ovens')
        .then((res) => commit('factoryOvensLoaded', res.data))
        .catch((e) => commit('operationError', e))
        .finally(() => commit('operationFinish'));
    },
    createShift({ commit }) {
      commit('operationStart');
      http.post(`/users/${this.state.currentUser.id}/create-shift`, { shiftCode: this.state.tmpShiftCode, className: 'java.util.Map' })
        .then((r) => commit('createShift', r))
        .catch((e) => commit('createShift', { error: e }))
        .finally(() => commit('operationFinish'));
    },
    loadProductFamilies({ commit }) {
      commit('operationStart');
      http.get('/product-families?not-empty')
        .then((r) => commit('loadProductFamilies', r))
        .catch((e) => commit('loadProductFamilies', { error: e }));
    },
    loadModelsForFamily({ commit }, productFamily) {
      commit('operationStart');
      http.get(`/product-families/${productFamily.id}/models?not-empty`)
        .then((r) => commit('loadProductModels', { ...r, famId: productFamily.id }))
        .catch((e) => commit('loadProductModels', { error: e }));
    },
    selectModel({ commit }, selectedModel) {
      commit('selectCurrentModel', selectedModel);
    },
    loadColors({ commit }) {
      commit('operationStart');
      http.get('/colors')
        .then((r) => commit('colorsLoaded', r))
        .catch((e) => commit('operationError', e))
        .finally(() => commit('operationFinish'));
    },
    selectColor({ commit }, color) {
      commit('colorSelected', color);
    },
    setCurrentWagon({ commit }, wagon) {
      commit('currentWagonSet', wagon);
    },
    loadOperators({ commit }) {
      commit('operationStart');
      http.get('/users')
        .then((r) => r.data.filter((op) => op.role.id == 3))
        .then((r) => commit('operatorsLoaded', r))
        .catch((e) => commit('operationError', e))
        .finally(() => commit('operationFinish'));
    },
    selectCastOperator({ commit }, operatorCode) {
      commit('castOperatorSelected', operatorCode);
    },
    selectCoatOperator({ commit }, operatorCode) {
      commit('coatOperatorSelected', operatorCode);
    },
    selectPolishOperator({ commit }, operatorCode) {
      commit('polishOperatorSelected', operatorCode);
    },
    createClassification({ commit }, payload) {
      commit('classificationCreated', payload);
    },
    saveClassification({ commit }, classification) {
      commit('operationStart');

      classification = {
        ...classification,
        currentOven: {
          ...classification.currentOven,
          wagons: [
            'java.util.ArrayList',
            classification.currentOven.wagons
          ]
        },
        defects: [
          'java.util.ArrayList',
          [...classification.defects]
        ]
      };

      http.post('/classification', classification)
        .then((r) => commit('classificationSaved', r.data))
        .catch((e) => commit('operationError', e))
        .finally(() => commit('operationFinish'));
    },
    loadQualityLevels({ commit }) {
      commit('operationStart');

      http.get('/quality-levels')
        .then((r) => commit('qualityLevelsLoaded', r.data))
        .catch((e) => commit('operationError', e))
        .finally(() => commit('operationFinish'));
    },
    loadDefectAreas({ commit }) {
      commit('operationStart');

      http.get('/defect-areas?not-empty')
        .then((r) => commit('defectAreasLoaded', r.data))
        .catch((e) => commit('operationError', e))
        .finally(() => commit('operationFinish'));
    },
    loadDefectsForArea({ commit }, area) {
      commit('operationStart');

      http.get(`/defect-areas/${area.id}/defects`)
        .then((r) => commit('defectsLoaded', { area, defects: r.data }))
        .catch((e) => commit('operationError', e))
        .finally(() => commit('operationFinish'));
    },
    selectDefectArea({ commit }, area) {
      commit('defectAreaSelected', area);
    },
    selectDefect({ commit }, defect) {
      commit('defectSelected', defect);
    },
    loadPieceZones({ commit }, { key, family, model }) {
      commit('operationStart');

      http.get(`/piece-zones/${family}/${model}`)
        .then((r) => commit('pieceZonesLoaded', { key, data: r.data }))
        .catch((e) => commit('operationError', e))
        .finally(() => commit('operationFinish'));
    },
    selectPieceZone({ commit }, zone) {
      commit('pieceZoneSelected', zone);
    },
    saveDefect({ commit }, defect) {
      commit('defectSaved', defect);
    },
    selectQuality({ commit }, quality) {
      commit('qualitySelected', quality);
    },
    selectRepairType({ commit }, repair) {
      commit('repairSelected', repair);
    },
    selectEvaluationType({ commit }, evaluation) {
      commit('evaluationSelected', evaluation);
    },
    loadRepairTypes({ commit }) {
      commit('operationStart');

      http.get(`/repair-types`)
        .then((r) => commit('repairTypesLoaded', r.data))
        .catch((e) => commit('operationError', e))
        .finally(() => commit('operationFinish'));
    },
    loadEvaluationTypes({ commit }) {
      commit('operationStart');

      http.get(`/evaluation-types`)
        .then((r) => commit('evaluationTypesLoaded', r.data))
        .catch((e) => commit('operationError', e))
        .finally(() => commit('operationFinish'));
    },
    selectCastDate({ commit }, castDate) {
      commit('castDateSelected', castDate);
    },
    selectWagonPosition({ commit }, wagonPosition) {
      commit('wagonPositionSelected', wagonPosition);
    },
    systemEvaluate({ commit }, defects) {
      commit('operationStart');

      let def = [
        'java.util.ArrayList',
        [...defects]
      ];

      http.post('/quality-check', def)
        .then((r) => commit('qualityEvaluated', r.data))
        .catch((e) => commit('operationError', e))
        .finally(() => commit('operationFinish'));
    },
    loadAllRules({ commit }) {
      commit('operationStart');

      http.get('/rules')
        .then((r) => commit('rulesLoaded', r.data))
        .catch((e) => commit('operationError', e))
        .finally(() => commit('operationFinish'));
    },
    deleteRuleById({ commit }, rule) {
      commit('operationStart');

      http.delete(`/rules/${rule.id}`)
        .then((r) => commit('ruleDeleted', r.data))
        .catch((e) => commit('operationError', e))
        .finally(() => commit('operationFinish'));
    },
    saveRule({ commit }, rule) {
      commit('operationStart');

      compileRuleClauses(rule);

      let url = '/rules';
      if (rule.id) {
        url += `/${rule.id}`;
      }

      // commit('operationFinish');
      return http.post(url, rule)
        .then((r) => commit('ruleSaved', { old: rule, rule: r.data }))
        .catch((e) => commit('operationError', e))
        .finally(() => commit('operationFinish'));
    }
  }
});

function convertClauseValue(value) {
  let newVal = value;
  if (value == "true" || value == "false") {
    if (value == "true") {
      newVal = "VERDADERO";
    } else {
      newVal = "FALSO";
    }
  }
  return newVal;
}

function convertRuleToClauses(rule) {
  let clauses = [];
  let tokens = rule.antecedent.split(/\s+/);
  clauses.push({
    param: tokens[0],
    operator: tokens[1],
    value: convertClauseValue(tokens[2])
  });
  tokens.splice(0, 3);
  while (tokens.length) {
    let toks = tokens.splice(0, 4);
    if (toks.length == 4) {
      let value = convertClauseValue(toks[3]);
      clauses.push({
        connector: toks[0],
        param: toks[1],
        operator: toks[2],
        value: value
      });
    }
  }
  return clauses;
}

function compileRuleClauses(rule) {
  let compiled = rule.clauses.map((c, index) => {
    let connector = c.connector && index != 0 ? ` ${c.connector} ` : '';
    return `${connector}${c.param} ${c.operator} ${parseClauseValue(c.value)}`;
  }).join('');

  rule.antecedent = compiled;
}

function parseClauseValue(value) {
  if (value == "VERDADERO") { value = "true" }
  if (value == "FALSO") { value = "false" }
  if (value == "true" || value == "false") {
    return value == "true";
  }

  if (!isNaN(Number(value))) {
    return Number(value);
  }

  return `"${value}"`;
}
