export interface ISassCompileResult {
    result: {
        css: string;
        map?: string;
    } | null;
    errorString: string | null;
}
