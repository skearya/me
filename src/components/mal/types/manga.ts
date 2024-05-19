export interface MangaListData {
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
	is_rereading: boolean;
	num_volumes_read: number;
	num_chapters_read: number;
	score: number;
	updated_at: string;
	start_date?: string;
	finish_date?: string;
}

export interface Node {
	id: number;
	title: string;
	main_picture: Mainpicture;
}

export interface Mainpicture {
	medium: string;
	large: string;
}
