export interface AnimeListData {
	data: Datum[];
	paging: Paging;
}

export interface Paging {
	next?: string;
}

export interface Datum {
	node: Node;
	list_status: Liststatus;
}

export interface Liststatus {
	status: string;
	score: number;
	num_episodes_watched: number;
	is_rewatching: boolean;
	updated_at: string;
	finish_date?: string;
	start_date?: string;
}

export interface Node {
	id: number;
	title: string;
	main_picture: Mainpicture;
	start_season: Startseason;
}

export interface Startseason {
	year: number;
	season: string;
}

export interface Mainpicture {
	medium: string;
	large: string;
}
