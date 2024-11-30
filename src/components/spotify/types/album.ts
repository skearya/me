export interface AlbumEmbedData {
  props: Props;
  page: string;
  query: Query;
  buildId: string;
  assetPrefix: string;
  isFallback: boolean;
  gssp: boolean;
  scriptLoader: any[];
}

interface Query {
  utm_source: string;
  id: string;
}

interface Props {
  pageProps: PageProps;
  __N_SSP: boolean;
}

interface PageProps {
  state: State;
  config: Config;
  _sentryTraceData: string;
  _sentryBaggage: string;
}

interface Config {
  correlationId: string;
  strings: Strings;
  locale: string;
  clientId: string;
  restrictionId: string;
}

interface Strings {
  en: En;
}

interface En {
  translation: Translation;
}

interface Translation {
}

interface State {
  data: Data;
  settings: Settings;
}

interface Settings {
  rtl: boolean;
  session: Session;
  entityContext: string;
  clientId: string;
  isMobile: boolean;
  isSafari: boolean;
  isIOS: boolean;
  isTablet: boolean;
  isDarkMode: boolean;
}

interface Session {
  accessToken: string;
  accessTokenExpirationTimestampMs: number;
  isAnonymous: boolean;
}

interface Data {
  entity: AlbumEntity;
  embeded_entity_uri: string;
  defaultAudioFileObject: DefaultAudioFileObject;
}

interface DefaultAudioFileObject {
  passthrough: string;
}

export interface AlbumEntity {
  type: string;
  name: string;
  uri: string;
  id: string;
  title: string;
  subtitle: string;
  coverArt: null;
  releaseDate: null;
  duration: number;
  maxDuration: number;
  isPlayable: boolean;
  isExplicit: boolean;
  hasVideo: boolean;
  relatedEntityUri: string;
  trackList: TrackList[];
  visualIdentity: VisualIdentity;
}

interface VisualIdentity {
  backgroundBase: BackgroundBase;
  backgroundTintedBase: BackgroundBase;
  textBase: BackgroundBase;
  textBrightAccent: BackgroundBase;
  textSubdued: BackgroundBase;
  image: Image[];
}

interface Image {
  url: string;
  maxHeight: number;
  maxWidth: number;
}

interface BackgroundBase {
  alpha: number;
  blue: number;
  green: number;
  red: number;
}

interface TrackList {
  uri: string;
  uid: string;
  title: string;
  subtitle: string;
  isExplicit: boolean;
  duration: number;
  isPlayable: boolean;
  audioPreview: AudioPreview;
}

interface AudioPreview {
  format: string;
  url: string;
}