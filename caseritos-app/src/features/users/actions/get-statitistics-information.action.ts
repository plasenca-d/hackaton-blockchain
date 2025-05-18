import { auth } from "@/auth";

interface StatisticInformation {
  averageRating: number;
  totalReviews: number;
  totalSellsCurrentMonth: number;
}

export const getStatisticsInformationAction =
  async (): Promise<StatisticInformation> => {
    const session = await auth();

    if (!session) {
      return {
        averageRating: 0,
        totalReviews: 0,
        totalSellsCurrentMonth: 0,
      };
    }

    return {
      averageRating: 4.5,
      totalReviews: 18,
      totalSellsCurrentMonth: 18,
    };
  };
