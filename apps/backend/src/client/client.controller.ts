import { User } from '@/decorators/user.decorator';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ClientService } from './client.service';
import { AuthGuard } from '@/guards/auth.guard';
import { AuthClientData } from '@/auth/dto/login.dto';

@Controller('client')
@UseGuards(AuthGuard)
export class ClientController {

  constructor(private readonly clientService: ClientService) { }

  @Get('farmers')
  getClientFamers(@User() client: AuthClientData) {
    return this.clientService.getClientFarmers(client.id);
  }

  @Get('leads')
  getClientLeads(@User() client: AuthClientData) {
    return this.clientService.getClientLeads(client.id);
  }

  @Get('me')
  getClientMe(@User() client: AuthClientData) {
    return this.clientService.getClientById(client.id);
  }

  @Get(':id')
  getClient(@Param('id') id: string) {
    return this.clientService.getClientById(id);
  }
}
