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
    tmpRuleModel: null,
    productsPerWagon: {},
    shiftTypes: [],
    productToEdit: null,
    productList: [],
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
      let wagonCode = wagon.wagon.padStart(2, "0");
      state.tmpStartWagons = {
        ...state.tmpStartWagons,
        [wagon.oven.id]: wagon.oven.wagons.filter(w => w.code == wagonCode)[0]
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
      console.error(e);
    },
    createShift: (state, result) => {
      state.loading = false;
      state.operationError = result.error;
      state.operationSuccessful = result.error == null;
      if (state.operationSuccessful) {
        state.currentShift = {
          className: "com.pmvb.scpiback.data.models.OperatorWorkShift",
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
      state.currentClassification = {
        ...state.currentClassification,
        productModel: model,
        product: model,
        productFamily: model.productFamily,
      };

      // if is editing product in wagon 
      if (state.productToEdit) {
        // Update products per wagon
        let oven = state.currentClassification.currentOven;
        let currentWagon = state.currentClassification.currentWagon;
        let products = state.productsPerWagon[`${oven.id}:${currentWagon.id}`];
        let color = state.currentClassification.color;
        let product = products.filter((p) => {
          return p.productModel.id == model.id
            && p.color.id == color.id;
        });
        product = product[0];
        console.log(product);
        // if product is not in `productsPerWagon` entry
        // or product has classified pieces (!= 0), prepend it
        // else (if product has no classifiedPieces), replace it
        if (typeof (product) === "undefined") {
          let newProduct = {
            ...state.productToEdit,
            quantity: 0,
            classifiedPieces: 0,
            productModel: model,
            productFamily: model.productFamily,
          };

          products = [
            newProduct,
            ...products,
          ];

          // if (state.productToEdit.classifiedPieces != 0) {
          //   products = [
          //     newProduct,
          //     ...products,
          //   ];
          // } else {
          //   let index = products.indexOf(state.productToEdit);
          //   products[index] = newProduct;
          // }
        }// else {
        //   let newProduct = {
        //     ...state.productToEdit,
        //     quantity: 0,
        //     classifiedPieces: 0,
        //     productModel: model,
        //     productFamily: model.productFamily,
        //   };
        //   let index = products.indexOf(state.productToEdit);
        //   products[index] = newProduct;
        // }

        state.productsPerWagon = {
          ...state.productsPerWagon,
          [`${oven.id}:${currentWagon.id}`]: [...products]
        };

        state.productToEdit = null;
      }
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
    classificationCreated: (state, { oven, wagon, products }) => {
      // let defects = state.currentClassification.defects;
      // if (state.currentClassification.oven != oven || state.currentClassification.currentWagon != wagon) {
      //   defects = [];
      // }
      if (!products) {
        products = state.productsPerWagon[`${oven.id}:${wagon.id}`];
      }
      console.log(products);
      let product = getNextProductForWagon(products);
      console.log(product);
      state.currentClassification = {
        ...state.currentClassification,
        workshift: state.currentShift,
        shift: state.currentShift.workshift,
        quantity: 1,
        defects: [],
        currentWagon: wagon,
        productionWagon: wagon,
        currentOven: oven,
        productionOven: { ...oven, wagons: ['java.util.ArrayList', ...oven.wagons] },
        polishOperator: wagon.polishOperator,
        coatOperator: wagon.coatOperator,
        castOperator: wagon.castOperator,
        classifierOperator: state.currentUser,
        productFamily: product ? product.productFamily : null,
        productModel: product ? product.productModel : null,
        color: product ? product.color : null,
      };
    },
    classificationSaved: (state, { sentData, classification }) => {
      state.classifications.push(classification);
      console.log(sentData, classification);
      // Update products per wagon
      let oven = sentData.currentOven;
      let products = state.productsPerWagon[`${oven.id}:${sentData.currentWagon.id}`];
      let product = products.filter((p) => {
        return p.productModel.id == sentData.productModel.id
          && p.color.id == sentData.color.id;
      });
      product = product[0];
      if (typeof (product) === "undefined") {
        product = {
          productFamily: sentData.productFamily,
          productModel: sentData.productModel,
          classifiedPieces: 0,
          quantity: 0,
          color: sentData.color,
          wagon: sentData.currentWagon,
          oven: oven
        };
        product.classifiedPieces += classification.quantity;
        product.quantity = classification.quantity;
        products = [
          product,
          ...products
        ];
      } else {
        product.classifiedPieces += classification.quantity;
        if (product.classifiedPieces > product.quantity) {
          product.quantity = product.classifiedPieces;
        }
        let index = products.indexOf(product);
        products[index] = product;
      }

      state.productsPerWagon = {
        ...state.productsPerWagon,
        [`${oven.id}:${sentData.currentWagon.id}`]: [...products]
      };
      console.log(state.productsPerWagon);

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
          ...rule,
        }
      ];
    },
    quantitySelected: (state, quantity) => {
      state.currentClassification = {
        ...state.currentClassification,
        quantity
      };
    },
    tmpRuleModelSet: (state, model) => {
      state.tmpRuleModel = model ? { ...model } : null;
    },
    addedDefectToRule: (state, defect) => {
      let newClauses = getClausesForDefect(defect);
      let currentClauses = !state.tmpRuleModel ? [] : [...state.tmpRuleModel.clauses];

      currentClauses.splice(state.tmpRuleModel.factIndex, 0, ...newClauses);
      state.tmpRuleModel = {
        ...state.tmpRuleModel,
        clauses: currentClauses,
      };
    },
    wagonProductsLoaded: (state, { ovenId, wagonId, data }) => {
      state.productsPerWagon = {
        ...state.productsPerWagon,
        [`${ovenId}:${wagonId}`]: data
      };
    },
    shiftTypesLoaded: (state, types) => {
      state.shiftTypes = types;
    },
    shiftEnd: (state) => {
      state.currentShift = null;
      state.currentClassification = {};
    },
    startModelSelection: (state) => {
      let oven = state.currentClassification.currentOven;
      let wagon = state.currentClassification.currentWagon;
      state.productToEdit = state.productsPerWagon[`${oven.id}:${wagon.id}`].filter((p) => {
        return p.productModel.id == state.currentClassification.productModel.id
          && p.color.id == state.currentClassification.color.id;
      })[0];
      console.log(state.productToEdit);
    },
    loadAllModels: (state, products) => {
      state.productList = products;
    },
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
        .catch((e) => commit('createShift', e.response.data))
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
    loadAllProducts({ commit }) {
      commit('operationStart');
      http.get('/products')
        .then((r) => commit('loadAllModels', r.data))
        .catch((e) => commit('operationError', e))
        .finally(() => commit('operationFinish'));
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
          [...(classification.defects || [])]
        ]
      };

      return http.post('/classification', classification)
        .then((r) => {
          commit('classificationSaved', { sentData: classification, classification: r.data });
          return classification;
        })
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
        [...(defects || [])]
      ];

      return http.post('/quality-check', def)
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

      return http.delete(`/rules/${rule.id}`)
        .then((r) => commit('ruleDeleted', r.data))
        .catch((e) => commit('operationError', e))
        .finally(() => commit('operationFinish'));
    },
    saveRule({ commit }, rule) {
      commit('operationStart');

      compileRuleClauses(rule);
      rule.consequent = `${rule.consequentName} = ${rule.consequentValue}`;

      let url = '/rules';
      if (rule.id) {
        url += `/${rule.id}`;
      }

      // commit('operationFinish');
      return http.post(url, rule)
        .then((r) => commit('ruleSaved', { old: rule, rule: r.data }))
        .catch((e) => commit('operationError', e))
        .finally(() => commit('operationFinish'));
    },
    selectClassifiedQuantity({ commit }, quantity) {
      commit('quantitySelected', quantity);
    },
    setTmpRuleModel({ commit }, model) {
      commit('tmpRuleModelSet', model);
    },
    addDefectToRule({ commit }, defect) {
      commit("addedDefectToRule", defect);
    },
    loadProductsForWagon({ commit }, { ovenId, wagonId }) {
      commit('operationStart');

      return http.get(`/ovens/${ovenId}/wagon-products/${wagonId}`)
        .then((res) => {
          commit('wagonProductsLoaded', { ovenId, wagonId, data: res.data });
          return res.data;
        })
        .catch((e) => commit('operationError', e))
        .finally(() => commit('operationFinish'));
    },
    loadShiftTypes({ commit }) {
      commit('operationStart');

      return http.get(`/shift-types`)
        .then((r) => commit('shiftTypesLoaded', r.data))
        .catch((e) => commit('operationError', e))
        .finally(() => commit('operationFinish'));
    },
    endShift({ commit }) {
      commit('shiftEnd');
    },
    getClassificationReport({ commit }, { shiftId, ovenId, productId }) {
      commit('operationStart');

      let url = "/reports/classification?";
      shiftId = shiftId == "TODOS" ? "all" : shiftId;
      ovenId = ovenId == "TODOS" ? "all" : ovenId;
      productId = productId == "TODOS" ? "all" : productId;

      url += `shift=${shiftId}&oven=${ovenId}&product=${productId}`;

      return http.get(url)
        .then((r) => {
          let { report, ovenIds } = r.data;
          report = report[1];
          console.log(r.data, report, ovenIds);
          report = report.map((row) => {
            row.defects = row.defects[1];
            console.log(row.product);
            return {
              ...row,
              productCode: row.product.code,
              colorId: row.color.id,
              ovenId: ovenIds[row.id],
              assignedQCode: row.assignedQualityLevel ? row.assignedQualityLevel.code : '',
              systemQCode: row.systemQualityLevel ? row.systemQualityLevel.code : '',
              defectCode: row.defects.length ? row.defects[0].defectType.code : '',
              zoneCode: row.defects.length ? row.defects[0].affectedZone.code : '',
              wagonCode: row.productionWagon.code,
              castOp: row.castOperator.code,
              polishOp: row.polishOperator.code,
              coatOp: row.coatOperator.code,
            };
          });
          return report;
        })
        .catch((e) => commit('operationError', e))
        .finally(() => commit('operationFinish'));
    },
    getBreaksReport({ commit }, { shiftId, ovenId, productId }) {
      commit('operationStart');

      let url = "/reports/breaks?";
      shiftId = shiftId == "TODOS" ? "all" : shiftId;
      ovenId = ovenId == "TODOS" ? "all" : ovenId;
      productId = productId == "TODOS" ? "all" : productId;

      url += `shift=${shiftId}&oven=${ovenId}&product=${productId}`;

      return http.get(url)
        .then((r) => {
          let { report, ovenIds } = r.data;
          report = report[1];
          console.log(r.data, report, ovenIds);
          report = report.map((row) => {
            row.defects = row.defects[1];
            console.log(row.product);
            return {
              ...row,
              productCode: row.product.code,
              colorId: row.color.id,
              ovenId: ovenIds[row.id],
              assignedQCode: row.assignedQualityLevel ? row.assignedQualityLevel.code : '',
              systemQCode: row.systemQualityLevel ? row.systemQualityLevel.code : '',
              defectCode: row.defects.length ? row.defects[0].defectType.code : '',
              zoneCode: row.defects.length ? row.defects[0].affectedZone.code : '',
              wagonCode: row.productionWagon.code,
              castOp: row.castOperator.code,
              polishOp: row.polishOperator.code,
              coatOp: row.coatOperator.code,
            };
          });
          return report;
        })
        .catch((e) => commit('operationError', e))
        .finally(() => commit('operationFinish'));
    },
    startModelSelection({ commit }) {
      commit('startModelSelection');
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
  console.log(compiled);
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

function getClausesForDefect(defect) {
  let clauses = [];
  clauses.push({
    connector: "&&",
    param: defect.defectType.factName,
    operator: "==",
    value: "VERDADERO",
  });
  console.log(clauses);
  return clauses;
}

function getNextProductForWagon(productList) {
  // Get products not classified
  let availableProducts = productList.filter((p) => p.quantity > p.classifiedPieces);
  console.log(productList, availableProducts);
  if (availableProducts.length > 0) {
    return availableProducts[0];
  }
  return null;
}