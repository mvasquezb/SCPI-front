import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'
import DashboardLayout from '@/layout/dashboard/DashboardLayout.vue';
import NotFound from "@/pages/NotFoundPage.vue";
import Login from '@/pages/Login.vue';
import ModelSelection from '@/views/ModelSelection.vue';
import ColorSelection from '@/views/ColorSelection.vue';
import CoatSelection from '@/views/CoatSelection.vue';
import CastSelection from '@/views/CastSelection.vue';
import PolishSelection from '@/views/PolishSelection.vue';
import QualityCheck from '@/views/QualityCheck.vue';
import DefectAreaSelection from '@/views/DefectAreaSelection.vue';
import DefectSelection from '@/views/DefectSelection.vue';
import PieceZoneSelection from '@/views/PieceZoneSelection.vue';
import QualitySelection from '@/views/QualitySelection.vue';
import RepairSelection from '@/views/RepairSelection.vue';
import EvaluationSelection from '@/views/EvaluationSelection.vue';
import QuantitySelection from '@/views/QuantitySelection.vue';
import CastDateSelection from '@/views/CastDateSelection.vue';
import WagonPositionSelection from '@/views/WagonPositionSelection.vue';
import RuleIndex from '@/views/RuleIndex.vue';
import RuleDetail from '@/views/RuleDetail.vue';

Vue.use(Router)

const routes = [
  {
    path: "/",
    component: DashboardLayout,
    redirect: "/home",
    children: [
      {
        path: 'home',
        name: 'home',
        component: Home
      },
      {
        path: 'about',
        name: 'about',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue')
      },
      {
        path: 'model-selection',
        name: 'model-selection',
        component: ModelSelection,
      },
      {
        path: 'color-selection',
        name: 'color-selection',
        component: ColorSelection,
      },
      {
        path: 'polish-selection',
        name: 'polish-selection',
        component: PolishSelection,
      },
      {
        path: 'coat-selection',
        name: 'coat-selection',
        component: CoatSelection,
      },
      {
        path: 'cast-selection',
        name: 'cast-selection',
        component: CastSelection,
      },
      {
        path: 'quality-check',
        name: 'quality-check',
        component: QualityCheck,
      },
      {
        path: 'defect-area-selection',
        name: 'defect-area-selection',
        component: DefectAreaSelection,
        alias: '/rules/defect-area-selection'
      },
      {
        path: 'defect-selection',
        name: 'defect-selection',
        component: DefectSelection,
        alias: '/rules/defect-selection'
      },
      {
        path: 'pieceZone-selection',
        name: 'pieceZone-selection',
        component: PieceZoneSelection,
        alias: '/rules/pieceZone-selection'
      },
      {
        path: 'quality-selection',
        name: 'quality-selection',
        component: QualitySelection,
      },
      {
        path: 'repair-selection',
        name: 'repair-selection',
        component: RepairSelection,
      },
      {
        path: 'evaluation-selection',
        name: 'evaluation-selection',
        component: EvaluationSelection,
      },
      {
        path: 'quantity-selection',
        name: 'quantity-selection',
        component: QuantitySelection,
      },
      {
        path: 'castDate-selection',
        name: 'castDate-selection',
        component: CastDateSelection,
      },
      {
        path: 'wagon-position-selection',
        name: 'wagon-position-selection',
        component: WagonPositionSelection,
      },
      {
        path: 'rules',
        name: 'rules',
        component: RuleIndex,
      },
      {
        path: '/rules/:ruleId',
        name: 'rule-detail',
        component: RuleDetail
      }
    ]
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "*",
    name: "notfound",
    component: NotFound
  }
];

export default routes;