export interface PlaylistData {
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
	strings: Strings;
	locale: string;
	clientId: string;
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
	entity: Entity;
	embeded_entity_uri: string;
	defaultAudioFileObject: DefaultAudioFileObject;
	backgroundColor: string;
}

export interface DefaultAudioFileObject {
	passthrough: string;
}

export interface Entity {
	type: string;
	name: string;
	uri: string;
	id: string;
	title: string;
	subtitle: string;
	coverArt: CoverArt;
	releaseDate?: any;
	duration: number;
	maxDuration: number;
	isPlayable: boolean;
	isExplicit: boolean;
	hasVideo: boolean;
	relatedEntityUri: string;
	trackList: TrackList[];
}

export interface TrackList {
	uri: string;
	uid: string;
	title: string;
	subtitle: string;
	isExplicit: boolean;
	duration: number;
	isPlayable: boolean;
	audioPreview?: AudioPreview;
}

export interface AudioPreview {
	format: string;
	url: string;
}

export interface CoverArt {
	extractedColors: ExtractedColors;
	sources: Source[];
}

export interface Source {
	height: number;
	width: number;
	url: string;
}

export interface ExtractedColors {
	colorDark: ColorDark;
}

export interface ColorDark {
	hex: string;
}
