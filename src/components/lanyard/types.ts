// https://github.com/barbarbar338/react-use-lanyard/blob/main/src/types.ts

export interface LanyardResponse {
	success: boolean;
	data: LanyardData;
	error?: LanyardError;
}

export interface LanyardError {
	message: string;
	code: string;
}

export interface LanyardData {
	spotify?: Spotify;
	listening_to_spotify: boolean;
	discord_user: DiscordUser;
	discord_status: "online" | "idle" | "dnd" | "offline";
	kv?: Kv;
	activities: Activity[];
	active_on_discord_web: boolean;
	active_on_discord_mobile: boolean;
	active_on_discord_desktop: boolean;
}

export interface Kv {
	[key: string]: string;
}

export interface Spotify {
	track_id: string;
	timestamps: Timestamps;
	song: string;
	artist: string;
	album_art_url: string;
	album: string;
}

export interface Timestamps {
	start: number;
	end: number;
}

export interface Activity {
	type: number;
	state: string;
	name: string;
	id: string;
	flags?: number;
	emoji?: Emoji;
	created_at: number;
	application_id?: string;
	timestamps?: Timestamps;
	sync_id?: string;
	session_id?: string;
	party?: Party;
	details?: string;
	buttons?: string[];
	assets?: Assets;
}

export interface Party {
	id: string;
	size?: PartySize;
}

export interface PartySize {
	current_size: number;
	max_size: number;
}

export interface Assets {
	small_text: string;
	small_image: string;
	large_text: string;
	large_image: string;
}

export interface Timestamps {
	start: number;
}

export interface Emoji {
	name: string;
	id?: string;
	animated?: boolean;
}

export interface DiscordUser {
	username: string;
	global_name: string | null;
	public_flags: number;
	id: string;
	discriminator: string;
	bot: boolean;
	avatar: string;
}
