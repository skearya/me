export interface TrackEmbedData {
	props: Props;
	page: string;
	query: Query;
	buildId: string;
	assetPrefix: string;
	isFallback: boolean;
	gssp: boolean;
	appGip: boolean;
	scriptLoader: any[];
}

export interface Query {
	id: string;
}

export interface Props {
	pageProps: PageProps;
	__N_SSP: boolean;
}

export interface PageProps {
	_sentryTraceData: string;
	_sentryBaggage: string;
	state: State;
	config: Config;
}

export interface Config {
	correlationId: string;
	clientId: string;
	strings: Strings;
	locale: string;
}

export interface Strings {
	en: En;
}

export interface En {
	translation: Translation;
}

export interface Translation {}

export interface State {
	data: Data;
	settings: Settings;
}

export interface Settings {
	rtl: boolean;
	session: Session;
	entityContext: string;
	clientId: string;
	isPremiumOnlyMarket: boolean;
	isMobile: boolean;
	isSafari: boolean;
	isIOS: boolean;
	isTablet: boolean;
}

export interface Session {
	accessToken: string;
	accessTokenExpirationTimestampMs: number;
	isAnonymous: boolean;
}

export interface Data {
	entity: TrackEntity;
	embeded_entity_uri: string;
	defaultAudioFileObject: DefaultAudioFileObject;
	backgroundColor: string;
}

export interface DefaultAudioFileObject {
	passthrough: string;
}

export interface TrackEntity {
	type: string;
	name: string;
	uri: string;
	id: string;
	title: string;
	artists: Artist[];
	coverArt: null;
	releaseDate: ReleaseDate;
	duration: number;
	isPlayable: boolean;
	isExplicit: boolean;
	audioPreview: AudioPreview;
	hasVideo: boolean;
	relatedEntityUri: string;
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

interface AudioPreview {
	url: string;
}

interface ReleaseDate {
	isoString: string;
}

interface Artist {
	name: string;
	uri: string;
}
