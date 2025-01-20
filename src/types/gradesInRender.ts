export interface GradesInRender {
  id: number;
  attributes: {
    grade: {
      data: {
        id: number;
        attributes: {
          gradeName: string;
          daysPlayed: string;
          gender: string;
          ageGroup: string;
          url: string;
          updatedAt: string;
          publishedAt: string;
          gradeId: string;
          ladder: Array<{
            position: string;
            teamName: string;
            teamHref: string;
            P: string;
            PTS: string;
            Q: string;
            W: string;
            L: string;
            TIE: string;
            N_R: string;
            BYE: string;
          }>;
        };
      };
    };
    updatedAt: string;
    publishedAt: string;
  };
}
