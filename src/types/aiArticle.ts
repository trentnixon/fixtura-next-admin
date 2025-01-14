export interface AiArticleAttributes {
  Name: string;
  grouping_category: string;
  ArticleJournalist: string;
  ArticleEditor: string;
  hasBias: string;
  openAiID: string;
  openAiCreated: number;
  openAiPrompt_tokens: number;
  openAiCompletionTokens: number;
  openAiTotalTokens: number;
  hasCompleted: boolean;
  forceRerender: boolean;
  hasError: boolean;
  assetLinkID: string;
  asset_type: {
    data: {
      attributes: {
        Name: string;
      };
    };
  };
  asset_category: {
    data: {
      attributes: {
        Name: string;
      };
    };
  };
  asset: {
    data: {
      attributes: {
        Name: string;
      };
    };
  };
}

export interface AiArticle {
  id: number;
  attributes: AiArticleAttributes;
}

export interface AiArticleState {
  aiArticle: AiArticle | null;
  aiArticles: AiArticle[];
  loading: boolean;
  error: string | null;
}
