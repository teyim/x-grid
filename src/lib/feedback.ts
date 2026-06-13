export const feedbackTypes = ['feedback', 'bug', 'suggestion'] as const;

export type FeedbackType = (typeof feedbackTypes)[number];

export const feedbackOptions: Record<FeedbackType, string[]> = {
  feedback: ['easy_to_use', 'confusing', 'design_feedback', 'missing_feature'],
  bug: ['upload_issue', 'preview_issue', 'download_issue', 'mobile_layout_issue'],
  suggestion: ['new_grid_type', 'better_crop_zoom', 'more_platforms', 'seo_content_idea'],
};

export type FeedbackPayload = {
  type: FeedbackType;
  option: string;
  rating?: number | null;
  message?: string;
  email?: string;
  route?: string;
  locale?: string;
  posthogDistinctId?: string;
};
