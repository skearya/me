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
	coverArt: CoverArt;
	releaseDate: ReleaseDate;
	duration: number;
	maxDuration: number;
	isPlayable: boolean;
	isExplicit: boolean;
	audioPreview: AudioPreview;
	hasVideo: boolean;
	relatedEntityUri: string;
}

export interface AudioPreview {
	url: string;
}

export interface ReleaseDate {
	isoString: string;
}

export interface CoverArt {
	extractedColors: ExtractedColors;
	sources: Source[];
}

export interface Source {
	url: string;
	width: number;
	height: number;
}

export interface ExtractedColors {
	colorDark: ColorDark;
	colorLight: ColorDark;
}

export interface ColorDark {
	hex: string;
}

export interface Artist {
	name: string;
	uri: string;
}
