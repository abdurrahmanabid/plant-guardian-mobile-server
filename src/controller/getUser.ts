import { NextFunction, Request, Response } from 'express';
import { getUserId } from '../utils/getUserId';
import { prisma } from '../helpers/prisma';

export const getUser =async (req: Request, res: Response, next: NextFunction)=> {
  try {
    const id:string = getUserId(req)

    const user= await prisma.user.findUnique({
      where:{id}
    })
    if(user){
      res.send({...user,password:undefined})
    }
  } catch (error) {
    res.status(500).json({message:"An error occur"})
    throw error
  }
};
