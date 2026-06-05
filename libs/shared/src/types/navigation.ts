import { ParamListBase } from '@react-navigation/native';

export interface HomeStackParamList extends ParamListBase {
  Home: undefined;
  Details: { itemId: string; title: string; desc: string };
}

export interface TabParamList extends ParamListBase {
  HomeStack: undefined;
  Persistence: undefined;
  Profile: undefined;
}

export interface DrawerParamList extends ParamListBase {
  MainTabs: undefined;
  Settings: undefined;
  HooksPlayground: undefined;
  PermissionsPlayground: undefined;
  APIsPlayground: undefined;
  TurboModulePlayground: undefined;
  CodeReviewRFCs: undefined;
  MentoringJuniorDevs: undefined;
}


