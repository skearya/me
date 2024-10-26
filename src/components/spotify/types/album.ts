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

interface Translation {}

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
	backgroundColor: string;
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
	coverArt: CoverArt;
	releaseDate: null;
	duration: number;
	maxDuration: number;
	isPlayable: boolean;
	isExplicit: boolean;
	hasVideo: boolean;
	relatedEntityUri: string;
	trackList: TrackList[];
	visualIdentity: null;
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

interface CoverArt {
	extractedColors: ExtractedColors;
	sources: Source[];
}

interface Source {
	height: number;
	width: number;
	url: string;
}

interface ExtractedColors {
	colorDark: ColorDark;
}

interface ColorDark {
	hex: string;
}
