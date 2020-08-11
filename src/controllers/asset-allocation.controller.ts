import express, { Request, Response } from 'express';
import { AssetAllocationParametersException } from '../exceptions/asset-allocation-parameters-exception';
import { asyncHandlerMiddleware } from '../middleware/async-handler.middleware';
import { AssetAllocation } from '../models/asset-allocation';
import { AssetAllocationService } from '../services/asset-allocation.service';

export const assetAllocationRouter: express.Router = express.Router();
const assetAllocationService: AssetAllocationService = new AssetAllocationService();

/**
 * @swagger
 *
 * /asset-allocation:
 *   get:
 *     summary: Calculate the asset allocation
 *     tags:
 *       - Asset Allocation
 *     parameters:
 *       - in: query
 *         name: symbols
 *         type: array
 *         items:
 *           type: string
 *         required: true
 *         description: A list of ticker symbols delimited by commas
 *       - in: query
 *         name: shares
 *         type: array
 *         items:
 *           type: number
 *         required: true
 *         description: A list of share quantities delimited by commas
 *       - in: query
 *         name: targetWeights
 *         type: array
 *         items:
 *           type: number
 *         description: A list of target weights as percentages delimited by commas
 *       - in: query
 *         name: contribution
 *         type: number
 *         description: The contribution amount
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         description: Bad Request
 */
assetAllocationRouter.get(
  '/asset-allocation',
  asyncHandlerMiddleware(
    async (req: Request, res: Response): Promise<void> => {
      let symbolsQueryParam: string;
      let symbolsArray: string[];
      let sharesQueryParam: string;
      let sharesArray: number[];
      let targetWeightsQueryParam: string;
      let targetWeightsArray: number[] | undefined = undefined;
      let contributionQueryParam: string;
      let contribution = 0;

      if (req.query.symbols !== undefined) {
        // Parse symbols array
        symbolsQueryParam = req.query.symbols.toString();
        symbolsArray = symbolsQueryParam.split(',');
      } else {
        throw new AssetAllocationParametersException(
          400,
          'Symbols must be defined!'
        );
      }

      if (req.query.shares !== undefined) {
        // Parse shares array
        sharesQueryParam = req.query.shares.toString();

        sharesArray = sharesQueryParam.split(',').map((shares: string) => {
          const parsedShares: number = parseFloat(shares);

          if (isNaN(parsedShares)) {
            throw new AssetAllocationParametersException(
              400,
              'Shares must be numbers!'
            );
          } else {
            return parsedShares;
          }
        });
      } else {
        throw new AssetAllocationParametersException(
          400,
          'Shares must be defined!'
        );
      }

      if (req.query.targetWeights !== undefined) {
        // Parse target weights array
        targetWeightsQueryParam = req.query.targetWeights.toString();

        targetWeightsArray = targetWeightsQueryParam
          .split(',')
          .map((targetWeight: string) => {
            const parsedTargetWeight: number = parseFloat(targetWeight);

            if (isNaN(parsedTargetWeight)) {
              throw new AssetAllocationParametersException(
                400,
                'Target weights must be numbers!'
              );
            } else {
              return parsedTargetWeight;
            }
          });
      }

      if (req.query.contribution !== undefined) {
        // Parse contribution amount
        contributionQueryParam = req.query.contribution.toString();

        try {
          contribution = parseFloat(contributionQueryParam);
        } catch (error) {
          throw new AssetAllocationParametersException(
            400,
            'Contribution must be a number!'
          );
        }
      }

      if (targetWeightsArray !== undefined) {
        const assetAllocations: AssetAllocation[] = await assetAllocationService.calculateAssetAllocationWithDeltas(
          symbolsArray,
          sharesArray,
          targetWeightsArray,
          contribution
        );

        res.json(assetAllocations);
      } else {
        const assetAllocations: AssetAllocation[] = await assetAllocationService.calculateAssetAllocations(
          symbolsArray,
          sharesArray
        );

        res.json(assetAllocations);
      }
    }
  )
);
