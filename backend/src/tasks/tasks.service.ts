import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskStatus } from './task.entity';
import { User } from '../users/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
  ) {}

  findAllByUser(userId: string) {
    return this.tasksRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async create(userId: string, dto: CreateTaskDto) {
    const task = this.tasksRepository.create({
      title: dto.title,
      description: dto.description,
      status: dto.status ?? TaskStatus.PENDING,
      completedAt: dto.status === TaskStatus.DONE ? new Date() : null,
      user: { id: userId } as User,
    });

    return this.tasksRepository.save(task);
  }

  async update(userId: string, taskId: string, dto: UpdateTaskDto) {
    const task = await this.tasksRepository.findOne({
      where: { id: taskId, user: { id: userId } },
    });

    if (!task) {
      throw new NotFoundException('Tarefa nao encontrada');
    }

    if (dto.title !== undefined) task.title = dto.title;
    if (dto.description !== undefined) task.description = dto.description;

    if (dto.status !== undefined) {
      task.status = dto.status;
      task.completedAt = dto.status === TaskStatus.DONE ? new Date() : null;
    }

    return this.tasksRepository.save(task);
  }

  async remove(userId: string, taskId: string) {
    const task = await this.tasksRepository.findOne({
      where: { id: taskId, user: { id: userId } },
    });

    if (!task) {
      throw new NotFoundException('Tarefa nao encontrada');
    }

    await this.tasksRepository.remove(task);
    return { success: true };
  }
}
